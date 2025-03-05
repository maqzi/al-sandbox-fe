import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { User, Mail } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." })
})

interface DemoSignupFormProps {
  onComplete: (data: z.infer<typeof formSchema>) => void;
}

export function DemoSignupForm({ onComplete }: DemoSignupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: ""
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'demo_signup', {
        email: values.email
      });
    }
    toast.success("Welcome to alitheia Labs!");
    onComplete(values);
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome to alitheia Labs</h1>
        <p className="text-gray-500">Please sign up below to begin:</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="John Doe" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="john@example.com" type="email" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Start Demo</Button>
        </form>
      </Form>
    </div>
  )
}