"use client";
import { useLingui } from "@lingui/react/macro";
import { usePathname, useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "zh-TW", name: "繁體中文" },
  { code: "en", name: "English" },
];

export default function useLangPref() {
  const { i18n } = useLingui();
  const pathname = usePathname();
  const router = useRouter();

  const handleLangSwitch = async (locale) => {
    const isValid = LANGUAGES.some((lang) => lang.code === locale);
    const pathNameWithoutLocale = pathname?.split("/")?.slice(2) ?? [];
    if (isValid) {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 365); // Set the expiration in days
      document.cookie = `NEXT_LOCALE=${locale}; path=/; expires=${expireDate.toUTCString()};`;
      router.push(`/${locale}/${pathNameWithoutLocale}`);
    }
  };

  return {
    lang: i18n?.locale,
    handleLangSwitch,
  };
}
