import { useNavigate } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";

export function AnimatedSearchInput() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const placeholders = [
    "Cari regulasi tentang verifikasi klaim rawat inap...",
    "Tanya tentang prosedur penolakan klaim...",
    "Cari SOP verifikasi dokumen klaim...",
    "Tanya tentang kriteria kelengkapan berkas...",
  ];

  useEffect(() => {
    const currentPlaceholder = placeholders[placeholderIndex];
    const typingSpeed = 50;
    const deletingSpeed = 30;
    const pauseTime = 2000;

    const timer = setTimeout(
      () => {
        if (!isDeleting && charIndex === currentPlaceholder.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
          return;
        }

        if (!isDeleting && charIndex < currentPlaceholder.length) {
          setDisplayedText(currentPlaceholder.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          return;
        }

        if (charIndex <= 0) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          return;
        }

        setDisplayedText(currentPlaceholder.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, placeholderIndex]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleSearch = (query: string) => {
    navigate({
      to: "/dashboard/chat",
      search: { q: query },
    });
  };

  return (
    <div className="relative">
      <Input
        className="h-12 border-2 border-primary pr-12 text-lg shadow-2xl transition-all"
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchSubmit}
        placeholder={displayedText}
        value={searchQuery}
      />
      <Button
        className="-translate-y-1/2 absolute top-1/2 right-2 p-0"
        onClick={handleSearchClick}
        size="sm"
        type="button"
      >
        Tanya <ArrowRightIcon />
      </Button>
    </div>
  );
}
