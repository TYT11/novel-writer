import LangSwitcher from "@/components/i18n/LangSwitcher";
import { Button } from "@/components/ui/button";
import { createNovel } from "@/lib/action";
import { auth } from "@/lib/auth/auth";
import { withLinguiPage } from "@/lib/i18n/withLingui";
import { Trans } from "@lingui/react/macro";
import Link from "next/link";

export default withLinguiPage(async function Index(props) {
  const { lang } = props;
  const session = await auth();

  return (
    <div className="">
      <div>
        <p>
          <Trans>This site is still under construction 🚧🚧🚧</Trans>
        </p>
        <p>
          <Trans>
            Check out how the editor looks like for now{" "}
            <Link
              locale={lang}
              className="font-bold underline"
              href={"/document"}
            >
              here
            </Link>
            !
          </Trans>

          <Button onClick={createNovel}>Create Project</Button>
          {session?.user?.id}
        </p>
      </div>
    </div>
  );
});
