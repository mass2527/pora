import { useRef, useState } from "react";
import { assert } from "~/lib/utils";

export function useSortableList<T, U extends HTMLElement>({
  initialSortableList,
  onSorted,
  draggable,
}: {
  initialSortableList: T[];
  // eslint-disable-next-line unused-imports/no-unused-vars
  onSorted: (sortedList: T[]) => void;
  draggable: boolean;
}) {
  const [sortableList, setSortableList] = useState(initialSortableList);
  const dragStartIndexRef = useRef(-1);

  return {
    sortableList,
    setSortableList,
    getSortableListItemProps: (index: number) => {
      return {
        onDragStart: () => {
          dragStartIndexRef.current = index;
        },
        onDragOver: (event: React.DragEvent<U>) => {
          const isDroppableListItem = index !== dragStartIndexRef.current;
          if (isDroppableListItem) {
            event.preventDefault();
          }
        },
        onDrop: () => {
          const targetCategory = sortableList.splice(
            dragStartIndexRef.current,
            1
          )[0];
          dragStartIndexRef.current = -1;
          assert(targetCategory);
          sortableList.splice(index, 0, targetCategory);
          setSortableList([...sortableList]);
          onSorted([...sortableList]);
        },
        draggable,
      };
    },
  };
}
