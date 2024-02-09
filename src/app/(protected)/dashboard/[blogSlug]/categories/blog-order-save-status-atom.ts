import { atom } from "jotai";

export const blogOrderSaveStatusAtom = atom<
  "순서 변경중..." | "순서 변경됨" | "순서 변경 실패" | ""
>("");
