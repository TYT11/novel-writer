import React from "react";
import { setI18n } from "@lingui/react/server";
import { t } from "@lingui/macro";
import { LinguiClientProvider } from "@/components/i18n/LinguiClientProvider";
import { allMessages, getI18nInstance } from "@/lib/i18n/appRouterI18n";
import { PageLangParam, withLinguiLayout } from "@/lib/i18n/withLingui";
import linguiConfig from "../../../lingui.config";
import "@/app/globals.css";

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageLangParam) {
  const { lang } = await params;
  const i18n = getI18nInstance(lang);
  setI18n(i18n);

  return {
    title: t(i18n)`editor`,
  };
}

export default withLinguiLayout(async function RootLayout({
  children,
  params,
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col">
          <LinguiClientProvider
            initialLocale={lang}
            initialMessages={allMessages[lang]!}
          >
            {children}
          </LinguiClientProvider>
        </main>
      </body>
    </html>
  );
});
