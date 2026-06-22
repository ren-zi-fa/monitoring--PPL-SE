import { z } from "zod";
console.log("Empty string:", z.coerce.number().safeParse(""));
console.log("Undefined:", z.coerce.number().safeParse(undefined));
console.log("Null:", z.coerce.number().safeParse(null));
