import { z } from "zod";

const schema = z.object({
  val: z.coerce.number().min(0)
});

console.log(schema.safeParse({ val: "" }));
