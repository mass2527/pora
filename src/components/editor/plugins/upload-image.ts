import { toast } from "sonner";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, EditorView } from "@tiptap/pm/view";
import { assert } from "~/lib/utils";
import { handleError } from "~/lib/errors";
import { uploadFileToS3 } from "~/services/file";

const uploadKey = new PluginKey("upload-image");

const UploadImagesPlugin = () =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        // See if the transaction adds or removes any placeholders
        // @ts-ignore
        const action = tr.getMeta(this);
        if (action && action.add) {
          const { id, pos, src } = action.add;

          const placeholder = document.createElement("div");
          placeholder.setAttribute("class", "img-placeholder");
          const image = document.createElement("img");
          image.setAttribute(
            "class",
            "opacity-40 rounded-lg border border-zinc-200"
          );
          image.src = src;
          placeholder.appendChild(image);
          const deco = Decoration.widget(pos + 1, placeholder, {
            id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action && action.remove) {
          set = set.remove(
            // @ts-ignore
            set.find(null, null, (spec) => spec.id == action.remove.id)
          );
        }
        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });

export default UploadImagesPlugin;

function findPlaceholder(state: EditorState, id: {}) {
  const decos = uploadKey.getState(state);
  // @ts-ignore
  const found = decos.find(null, null, (spec) => spec.id == id);
  return found.length ? found[0].from : null;
}

export function startImageUpload(file: File, view: EditorView, pos: number) {
  // check if the file is an image
  if (!file.type.includes("image/")) {
    toast.error("File type not supported.");
    return;

    // check if the file size is less than 4.5MB
  } else if (file.size / 1024 / 1024 > 4.5) {
    toast.error("File size too big (max 4.5MB).");
    return;
  }

  // A fresh object to act as the ID for this upload
  const id = {};

  // Replace the selection with a placeholder
  const tr = view.state.tr;
  if (!tr.selection.empty) tr.deleteSelection();

  const imageUploadPromise = handleImageUpload(file);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    tr.setMeta(uploadKey, {
      add: {
        id,
        pos,
        src: reader.result,
      },
    });
    view.dispatch(tr);

    try {
      const src = await imageUploadPromise;
      const { schema } = view.state;
      let pos = findPlaceholder(view.state, id);
      // If the content around the placeholder has been deleted, drop
      // the image
      if (pos == null) return;

      // Otherwise, insert it at the placeholder's position, and remove
      // the placeholder

      // When BLOB_READ_WRITE_TOKEN is not valid or unavailable, read
      // the image locally
      const imageSrc = typeof src === "object" ? reader.result : src;
      assert(schema.nodes.image);
      const node = schema.nodes.image.create({ src: imageSrc });
      const transaction = view.state.tr
        .replaceWith(pos, pos, node)
        .setMeta(uploadKey, { remove: { id } });
      view.dispatch(transaction);
    } catch (error) {
      tr.setMeta(uploadKey, {
        remove: {
          id,
        },
      });
      view.dispatch(tr);
    }
  };
}

export const handleImageUpload = (file: File) => {
  // upload to aws s3
  return new Promise((resolve, reject) => {
    toast.promise(
      uploadFileToS3(file).then(async (result) => {
        // Successfully uploaded image
        const url = result;

        // preload the image
        let image = new Image();
        image.src = url;
        image.onload = () => {
          resolve(url);
        };
        // No blob store configured
      }),
      {
        loading: "이미지 업로드중...",
        success: "이미지가 성공적으로 업로드 되었어요.",
        error: (error) => {
          handleError(error);
          reject(error);

          return "이미지를 업로드할 수 없어요.";
        },
      }
    );
  });
};

export function startLocalImageUpload(
  file: File,
  view: EditorView,
  pos: number
) {
  // check if the file is an image
  if (!file.type.includes("image/")) {
    toast.error("File type not supported.");
    return;

    // check if the file size is less than 4.5MB
  } else if (file.size / 1024 / 1024 > 4.5) {
    toast.error("File size too big (max 4.5MB).");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const { schema } = view.state;
    assert(schema.nodes.image);
    const node = schema.nodes.image.create({ src: reader.result });
    const transaction = view.state.tr.replaceWith(pos, pos, node);
    view.dispatch(transaction);
  };
}
