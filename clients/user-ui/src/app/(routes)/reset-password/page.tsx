import ResetPassword from "@/src/views/Auth/ResetPassword";

const page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const activationToken = searchParams["verify"] ?? "";

  return (
    <div>
      <ResetPassword activationToken={activationToken} />
    </div>
  );
};

export default page;
