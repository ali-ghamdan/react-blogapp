import { FormEvent, useEffect, useState } from "react";
import { authStore, routeStore } from "@/lib/stores";
import { RouteDirection, UserData } from "@/lib/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { userLogin, userProfile } from "@/lib/user";

export default function LoginPage() {
  const { auth, setAuth } = authStore();
  const { setRoute } = routeStore();
  const [user, setUser] = useState<UserData | undefined>(undefined);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [{ value: email }, { value: password }] = [
      ...document.querySelectorAll<HTMLInputElement>("#email,#password"),
    ];

    const accessToken = await userLogin({ email, password });
    if (!accessToken) {
      alert("CAN'T LOGIN TO THIS ACCOUNT, MAYBE DOESN'T EXISTS?.");
      return;
    }
    setAuth(accessToken);
    setRoute(RouteDirection.HOME_PAGE);
  };

  useEffect(() => {
    userProfile(auth || undefined)
      .then((data) => {
        setUser(data);
        console.log({ data });
        console.log({ user });
      })
      .catch(console.error);
  }, [auth]);

  return (
    <>
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className=" bg-zinc-950 w-full max-w-sm py-5 px-8 m-4 rounded-lg"
        >
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
              Login
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
