import { AlertDialogContent, AlertDialog, AlertDialogTrigger, AlertDialogTitle, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { tryCatch } from "@/hooks/trycatch"
import { AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import { Trash2 } from "lucide-react"
import { deleteChapter } from "../actions/actions"
import { useTransition } from "react"
import { toast } from "sonner"

const DeleteChapterModal = ({ chapterId, courseId }: { chapterId: string, courseId: string }) => {

  const [pending, startTransition] = useTransition()
  const onSubmit = () => {

    startTransition(async () => {
      const { data, error } = await tryCatch(deleteChapter(chapterId, courseId))

      if (error) {
        toast.error('un expected error occurred, Please try again.')
        return;
      }
      if (data.status === 'error') {
        toast.error(data.message)
        return;
      } else if (data.status === 'success') {
        toast.success(data.message)
        return
      }
    })

  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline"><Trash2 className="size-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete chapter and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} className={buttonVariants({ variant: 'outline' })}>{pending? 'Deleting...': 'Delete'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteChapterModal