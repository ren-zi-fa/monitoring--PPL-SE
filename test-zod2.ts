import { z } from "zod";

const objSchema = z.object({
  a: z.coerce.number(),
  b: z.coerce.number(),
  c: z.coerce.number(),
}).superRefine((data, ctx) => {
  console.log("Types:", typeof data.a, typeof data.b, typeof data.c);
  console.log("Values:", data.a, data.b, data.c);
  if (data.b + data.c > data.a) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Error", path: ["b"] });
  }
});

const res = objSchema.safeParse({a: "8", b: "0", c: "8"});
console.log("Result:", res);
