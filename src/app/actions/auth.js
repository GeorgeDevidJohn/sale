import { z } from 'zod';
import bcrypt from 'bcryptjs';

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

/**
 * @typedef {Object} FormState
 * @property {Object} [errors]
 * @property {string[]} [errors.name]
 * @property {string[]} [errors.email]
 * @property {string[]} [errors.password]
 * @property {string} [message]
 */

/** @type {FormState | undefined} */
let formState;

export async function signup(formData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Prepare data for API request
  const values = { name, email, password: hashedPassword };

  try {
    // Insert the user into the database or call an API
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const data = await response.json();
    const user = data[0];

    if (!user) {
      return {
        message: 'An error occurred while creating your account.',
      };
    }

    // Return the created user or success message
    return { user };
  } catch (error) {
    console.error('Error during signup:', error);
    return {
      message: 'An error occurred during signup. Please try again later.',
    };
  }
}
