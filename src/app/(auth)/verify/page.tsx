import VerifyOTP from "./_components/VerifyOTP";

interface iAppProps {
  params: Promise<{ email: string }>;
}
const page = async ({params}: iAppProps) => {
  const {email} = await params;
  return <VerifyOTP email={email}/>
};

export default page;
