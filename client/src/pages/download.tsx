import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fileCodeSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import type { FileCode } from "@shared/schema";

export default function Download() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<FileCode>({
    resolver: zodResolver(fileCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data: FileCode) => {
    setLocation(`/d/${data.code}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (!/^\d*$/.test(e.key) || value.length >= 4) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-[#2D3748] mb-4">
            Download shared file
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter 4-digit code"
                        className="text-center text-2xl tracking-widest font-mono"
                        maxLength={4}
                        onKeyPress={handleKeyPress}
                        inputMode="numeric"
                        pattern="\d*"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#4A154B] hover:bg-[#3D1240]"
                disabled={!form.formState.isValid}
              >
                Download File
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}