import { useUser } from "@clerk/clerk-react";


const AccountPage = () => {

    const {user} = useUser();

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold">My Account</h1>
        <div className="mt-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
                Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-x-4">
                    <p className="text-muted-foreground">Name: {user?.fullName}</p>
                </div>
                <div className="space-x-4">
                    <p className="text-muted-foreground">Email: {user?.emailAddresses[0].emailAddress}</p>
                </div>

            </div>
        </div>
    </main>
  );
};

export default AccountPage;