import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function ExerciseLinks() {
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const addLink = () => {
    if (newLink.trim() !== "") {
      setLinks([...links, newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm text-muted-foreground">Links</h4>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {links.length === 0 && !isEditing && (
          <p className="text-sm text-muted-foreground italic">
            No links added.
          </p>
        )}
        {links.map((link, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-sm py-1"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {link}
            </a>
            {isEditing && (
              <button
                className="text-xs text-red-500 hover:underline ml-3"
                onClick={() => removeLink(idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-3 flex gap-2">
          <input
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 p-2 text-sm border rounded-md bg-background"
          />
          <Button size="sm" onClick={addLink}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
