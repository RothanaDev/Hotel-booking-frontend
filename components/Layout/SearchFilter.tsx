"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomFiltersProps {
  keyword: string;
  setKeyword: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
}

export default function RoomFilters({
  keyword,
  setKeyword,
  type,
  setType,
  price,
  setPrice,
}: RoomFiltersProps) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-9 h-11 bg-white border-slate-300 focus:ring-amber-500 focus-visible:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
              Room Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-11 bg-white border-slate-300 focus:ring-amber-500">
                <SelectValue placeholder="All Room Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Room Types</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
                <SelectItem value="Family">Family</SelectItem>
                <SelectItem value="Due">Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
