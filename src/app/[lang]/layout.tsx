import React from "react";
import { setI18n } from "@lingui/react/server";
import { useLingui } from "@lingui/react/macro";
import { LinguiClientProvider } from "@/components/i18n/LinguiClientProvider";
import { allMessages, getI18nInstance } from "@/lib/i18n/appRouterI18n";
import { PageLangParam, withLinguiLayout } from "@/lib/i18n/withLingui";
import linguiConfig from "../../../lingui.config";
import "@/app/globals.css";
import LangSwitcher from "@/components/i18n/LangSwitcher";

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageLangParam) {
  const { lang } = await params;
  const i18n = getI18nInstance(lang);
  setI18n(i18n);
  const { t } = useLingui();

  return {
    title: t`editor`,
  };
}

export default withLinguiLayout(async function RootLayout({
  children,
  params,
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <LinguiClientProvider
        initialLocale={lang}
        initialMessages={allMessages[lang]!}
      >
        <body>
          <div className="container flex flex-col min-h-screen  mx-auto">
            <main className="flex flex-1 justify-center items-center">
              {children}
            </main>
            <footer className="flex justify-center items-end">
              <div className="mb-3">
                <LangSwitcher />
              </div>
            </footer>
          </div>
        </body>
      </LinguiClientProvider>
    </html>
  );
});
