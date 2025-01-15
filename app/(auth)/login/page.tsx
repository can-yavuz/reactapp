"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { startSession } from "@/lib/session";
import useAuthStore from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import loginUser from "@/actions/login";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email en az 2 karakter olmalı.",
  }),
  password: z.string().min(2, {
    message: "Şifre en az 2 karakter olmalı.",
  }),
});

const LoginPage = () => {
  const {loader, setLoader} = useAuthStore();
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:""
    },
  });
  
  const onSubmit=(data:z.infer<typeof formSchema>)=>{
    setLoader(true);

    loginUser(data.email, data.password).then(
      (resp)=>{
        startSession(resp.user, resp.jwt);
        toast({
          variant:"success",
          title: "Giriş Başarılı",
        })
        setLoader(false);
        router.push("/")
      },
      (error)=>{
        setLoader(false);
        console.error(error);
        toast({
          variant:"destructive",
          title: "Bir hata oluştu.",
        })

      }
    ).finally(()=>{
      setLoader(false)
    })

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-4/5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="textone">Email</FormLabel>
              <FormControl>
                <Input placeholder="Email adresiniz" {...field} />
              </FormControl>
              <FormMessage className="validationLogin" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="textone">Şifre</FormLabel>
              <FormControl>
                <Input placeholder="Şifreniz" type="password" {...field} />
              </FormControl>
              <FormMessage className="validationLogin" />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
        {loader? <Loader2Icon className="animate-spin"/> : "Login"}
        </Button>
      </form>
      <div className="mt-8">
        <Label className="flex flex-col items-center">
          Hesabınız Yok Mu?
          <Link
            href="/create-user"
            className="text-mycolor3 font-semibold mt-5"
          >
            Yeni bir hesap oluşturmak için buraya tıklayın.
          </Link>
        </Label>
      </div>
    </Form>
  );
};

export default LoginPage;
