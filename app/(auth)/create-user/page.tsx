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
import useAuthStore from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import registerUser from "@/actions/register";
import { startSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Kullanıcı adı en az 2 karakter olmalı.",
  }),
  email: z.string().min(2, {
    message: "Email en az 2 karakter olmalı.",
  }),
  password: z.string().min(2, {
    message: "Şifre en az 2 karakter olmalı.",
  }),
});

const CreateUserPage = () => {

  const {loader, setLoader} = useAuthStore();
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username:"",
      password:""
    },
  })

  const onSubmit=(data:z.infer<typeof formSchema>)=>{
    setLoader(true);

    registerUser(data.username, data.email, data.password).then(
      (resp)=>{
        startSession(resp.user, resp.jwt);
        toast({
          variant:"success",
          title: "Hesap Oluşturuldu",
        })
        setLoader(false);
        router.push("/")
      },
      (error)=>{
        setLoader(false);
        console.error(error);
        toast({
          variant:"destructive",
          title: "Bir Hata Meydana Geldi",
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
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage className="validationLogin" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="textone">Kullanıcı Adı</FormLabel>
              <FormControl>
                <Input placeholder="Kullanıcı Adınız" {...field} />
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
                <Input placeholder="Şifre" type="password" {...field} />
              </FormControl>
              <FormMessage className="validationLogin" />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {loader? <Loader2Icon className="animate-spin"/> : "Hesap Oluştur"}
        </Button>
      </form>
      <div className="mt-8">
        <Label className="flex flex-col items-center">
          Hesabınız Var Mı?
          <Link
            href="/login"
            className="text-mycolor3 font-semibold mt-5"
          >
            Hesabınızla giriş yapmak için buraya tıklayın.
          </Link>
        </Label>
      </div>
    </Form>
  );
};

export default CreateUserPage;
