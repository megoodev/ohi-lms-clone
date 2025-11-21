import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chapterSchema, ChapterSchemaType } from "@/lib/zodSchemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { createChapter } from "../actions/actions";
import { useState, useTransition } from "react";
import { tryCatch } from "@/hooks/trycatch";
import { toast } from "sonner";

interface NewChapterModalProps {
  courseId: string;
}

const NewChapterModal = ({ courseId }: NewChapterModalProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      courseId: courseId,
    },
  });
  const [pending, startTransition] = useTransition();
  const onSubmit = (values: ChapterSchemaType) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(createChapter(values));

      if (error) {
        toast.error("un expected error occurred, Please try again.");
        return;
      }
      if (data.status === "error") {
        toast.error(data.message);
        return;
      } else if (data.status === "success") {
        toast.success(data.message);
        setOpen(false);
        return;
      }
    });
  };
  const handelOpenChange = (open: boolean) => {
    setOpen(open);
    form.reset();
  };
  return (
    <Dialog open={open} onOpenChange={handelOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          Add New Chapter
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new chapter</DialogTitle>
          <DialogDescription>
            What would you like to name your chapter ?
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-4">
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="w-full md:w-fit" disabled={pending}>
                  {pending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewChapterModal;
