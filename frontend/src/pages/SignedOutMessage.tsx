import { SignInButton, SignUpButton } from "@clerk/clerk-react"

export const SignedOutMessage = () => {
    return (
        <div className="flex flex-col justify-start items-center h-screen m-2">
            <div className="flex flex-row text-2xl font-bold">You are not signed in!</div>
            <div className="text-sm m-2">Sign in or create an account to get started</div>
            <div className="flex flex-row gap-2 m-2">
                <SignInButton />
                <SignUpButton />
            </div>
        </div>
    )
}