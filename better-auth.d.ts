
import "better-auth";

declare module "better-auth" {
    interface User {
        job_title?: string | null;
        bio?: string | null;
    }
}