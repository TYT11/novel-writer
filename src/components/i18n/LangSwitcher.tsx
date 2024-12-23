"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useLangPref from "@/hooks/useLangPref";

const LANGUAGES = [
  { code: "zh-TW", name: "繁體中文" },
  { code: "en", name: "English" },
];

export default function LangSwitcher() {
  const { lang, handleLangSwitch } = useLangPref();

  return (
    <Select value={lang} onValueChange={handleLangSwitch}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => {
          return (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
