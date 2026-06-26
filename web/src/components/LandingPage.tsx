import { Link } from "react-router";
import TypeWriter from "typewriter-effect";
import styles from "../styles/landingPage.module.css";
import { Button } from "./ui/button";

function LandingPage() {
    return (
        <main className="flex justify-center items-center flex-col mt-10">
            <div className="w-full h-fit m-auto">
                <h1 className={styles.title}>Any Product, </h1>
                <TypeWriter
                    options={{
                        strings: ["Anywhere", "Anytime", "💖"],
                        autoStart: true,
                        loop: true,
                        delay: 75,
                        deleteSpeed: 35,
                        wrapperClassName: styles.title,
                        cursorClassName: styles.cursor,
                    }}
                ></TypeWriter>
            </div>
            <Link className=" mt-30" to={"/explore"}>
                <Button>Explore</Button>
            </Link>
        </main>
    );
}

export default LandingPage;
