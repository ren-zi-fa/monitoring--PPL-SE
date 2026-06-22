import { z } from "zod";

const schema = z.coerce.number();
console.log("Empty string:", schema.parse(""));
console.log("Empty string + 0:", schema.parse("") + 0);

const objSchema = z.object({
  a: z.coerce.number().min(0, "A>=0"),
  b: z.coerce.number().min(0, "B>=0")
}).superRefine((data, ctx) => {
  if (data.a + data.b > 10) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Error", path: ["a"] });
  }
});

console.log("Validating {a: '', b: 1}:", objSchema.safeParse({a: "", b: 1}));
