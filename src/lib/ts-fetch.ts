import { StringLiteralUnion } from "./types";

type Headers = HeadersInit & {
  // Add required types on demand
  "Content-Type"?: "application/json" | "text/plain";
};

interface Init extends RequestInit {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  headers?: Headers;
}

export function tsFetch(input: StringLiteralUnion<"/api/"> | URL, init?: Init) {
  return fetch(input, init);
}
