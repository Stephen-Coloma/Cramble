import { ObjectSchema } from "joi";

function validate<T>(data: T, objectSchema: ObjectSchema): boolean | object{
    const { error } = objectSchema.validate(data, { abortEarly: false });

    if (error) {
          // Collect all fields with error
          const invalidFields = error.details.map(detail => detail.path[0]);
          return {invalidFields};
    }

    // Validation passed
    return true;
}

export default validate;