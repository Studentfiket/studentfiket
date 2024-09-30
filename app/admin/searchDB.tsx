'use client'

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function SearchDB() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('s');
    if (searchQuery) {
      setSearchTerm(searchQuery.replace(/-/g, ' '));
    }
  }, [searchParams]);

  const handleSearchClick = () => {
    const slug = searchTerm.trim().replace(/\s+/g, '-').toLowerCase();
    window.location.href = `/admin?s=${slug}`;
  };

  return (
    <form className="flex flex-col sm:flex-row mb-4" onSubmit={(e) => { e.preventDefault(); handleSearchClick(); }}>
      <Input
        placeholder="Sök"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button type="submit" className='mt-4 sm:mt-0 sm:ml-4 py-4 flex justify-center'>
        Sök
      </Button>
    </form>
  );
}