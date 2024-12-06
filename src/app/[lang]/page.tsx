import { withLinguiPage } from "@/lib/i18n/withLingui";
import { Trans, useLingui } from "@lingui/react/macro";
import Link from "next/link";

export default withLinguiPage(function Index() {
  const { t } = useLingui();
  return (
    <div className="flex-1 flex justify-center items-center">
      <div>
        <p>
          <Trans>This site is still under construction 🚧🚧🚧</Trans>
        </p>
        <p>
          <Trans>
            Check out how the editor looks like for now{" "}
            <Link className="font-bold underline" href={"/document"}>
              here
            </Link>
            !
          </Trans>
        </p>
      </div>
    </div>
  );
});
