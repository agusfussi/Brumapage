"use client";

import { loginAction } from "../actions";
import { useActionState } from "react";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await loginAction(formData);
    if (result?.error) {
      return { error: result.error };
    }
    return { error: "" };
  }, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 fixed inset-0 z-[100]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Acceso Admin</h1>
        
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              className="w-full border rounded-md p-2 focus:ring focus:ring-pink-200 outline-none"
              placeholder="Ingresá la contraseña"
            />
          </div>
          
          {state.error && (
            <div className=" text-sm">{state.error}</div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#26140b] text-white  p-2 rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
