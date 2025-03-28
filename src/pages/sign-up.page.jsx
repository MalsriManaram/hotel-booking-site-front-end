import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const SignUpPage = () => {
    return ( 
        <motion.main
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center min-h-screen px-4"
        >
            <SignUp />
        </motion.main>


     );
}

export default SignUpPage;