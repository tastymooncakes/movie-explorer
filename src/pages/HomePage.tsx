import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-black text-white min-h-[60vh]">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-6">
                    Movie Explorer
                </h1>
            </div>
            <form onSubmit={handleSearch} className="w-full max-w-2xl space-y-4">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for movies"
                            className="pl-10 h-12 text-lg bg-gray-900 border-gray-700 placeholder:text-gray-400 focus:border-white focus:ring-white"
                            autoFocus
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={!searchQuery.trim()}
                        size="lg"
                        className="h-12 px-8 bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400"
                    >
                        Search
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default HomePage;