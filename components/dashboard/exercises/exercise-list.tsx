"use client";

import { useMemo, useState } from "react";
import { Exercise } from "@/types/exercise";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface ExerciseListProps {
  exercises: Exercise[];
}

const ITEMS_PER_PAGE = 10;

export function ExerciseList({ exercises }: ExerciseListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [customFilter, setCustomFilter] = useState<
    "all" | "custom" | "built-in"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const allModules = useMemo(() => {
    const modSet = new Set<string>();
    exercises.forEach((ex) => ex.modules.forEach((m) => modSet.add(m)));
    return Array.from(modSet);
  }, [exercises]);

  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
    setCurrentPage(1);
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesModules =
        selectedModules.length === 0 ||
        selectedModules.every((m) => ex.modules.includes(m));
      const matchesCustom =
        customFilter === "all" ||
        (customFilter === "custom" && ex.isCustom) ||
        (customFilter === "built-in" && !ex.isCustom);
      return matchesSearch && matchesModules && matchesCustom;
    });
  }, [exercises, searchTerm, selectedModules, customFilter]);

  const totalPages = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);
  const paginatedExercises = filteredExercises.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/3"
        />

        {/* Module Multiselect */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-1/4 justify-between"
            >
              {selectedModules.length > 0
                ? `${selectedModules.length} module${selectedModules.length > 1 ? "s" : ""}`
                : "Filter by module"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search modules..." />
              <CommandList>
                {allModules.map((mod) => (
                  <CommandItem
                    key={mod}
                    onSelect={() => toggleModule(mod)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={clsx(
                        "mr-2 h-4 w-4",
                        selectedModules.includes(mod)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {mod}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Custom Filter */}
        <Select
          value={customFilter}
          onValueChange={(val) => {
            setCustomFilter(val as "all" | "custom" | "built-in");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Custom filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="custom">Custom Only</SelectItem>
            <SelectItem value="built-in">Built-in Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table View */}
      {paginatedExercises.length === 0 ? (
        <p className="text-muted-foreground">No exercises found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Custom</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell className="font-medium">{exercise.name}</TableCell>
                <TableCell>{exercise.description || "—"}</TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  {exercise.modules.map((mod) => (
                    <span
                      key={mod}
                      className="text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground"
                    >
                      {mod}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  {exercise.isCustom ? (
                    <span className="text-green-600 text-xs font-medium">
                      Yes
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              Page {currentPage} of {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
