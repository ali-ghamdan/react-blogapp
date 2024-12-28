import { FormEvent, useEffect, useState } from "react";
import { authStore } from "@/lib/stores";
import { UserData } from "@/lib/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { userLogin, userProfile, userRegister } from "@/lib/user";

export default function RegisterPage() {
  const { auth, setAuth } = authStore();
  const [user, setUser] = useState<UserData | undefined>(undefined);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [{ value: username }, { value: email }, { value: password }] = [
      ...document.querySelectorAll<HTMLInputElement>(
        "#username,#email,#password"
      ),
    ];

    const isRegistered = await userRegister({ username, email, password });
    if (!isRegistered) {
      alert("SOMETHING WENT WRONG WHEN REGISTERING, TRY ANOTHER EMAIL.");
      return;
    }
    const accessToken = await userLogin({ email, password });
    if (!accessToken) {
      alert("CAN'T LOGIN TO THIS ACCOUNT, MAYBE DOESN'T EXISTS?.");
      return;
    }
    setAuth(accessToken);
  };

  useEffect(() => {
    userProfile(auth || undefined)
      .then((data) => {
        setUser(data);
        console.log({ user });
      })
      .catch(console.error);
  }, [auth]);

  return (
    <>
      <div className="flex justify-center relative">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950 w-full max-w-sm py-5 px-8 m-4 rounded-lg"
        >
          <div className="mt-2">
            <Label>
              <sup>Username:</sup>
            </Label>
            <Input id="username" type="text" placeholder="Ex. John Doe" />
          </div>
          <div className="mt-2">
            <Label>
              <sup>Email:</sup>
            </Label>
            <Input id="email" type="email" placeholder="Ex. john@doe.com" />
          </div>
          <div className="mt-2">
            <Label>
              <sup>Password:</sup>
            </Label>
            <Input id="password" type="password" placeholder="No Ex." />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              className="invert-rounding relative translate-x-8 translate-y-5 rounded-bl-none rounded-tr-none bg-black"
              type="submit"
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
