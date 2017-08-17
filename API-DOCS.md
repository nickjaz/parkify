# User Schema

The user schema has properties that verify the user.
- name: given at the time of signing up.
- email: unique email provided by the user
- password: given at the time of signing up
- tokenHash: Used to create a signed token and provides a random encrypted 32 byte string

```sh
const userSchema = Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokenHash: { type: String, unique: true }
});
```
