import type { Route } from "./+types/wipe";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind | Wipe" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="h-screen w-screen gird place-content-center">
      <div className="flex flex-col gap-2 items-center">
        <h4 className="text-xl font-semibold">
          Authenticated as: {auth.user?.username}
        </h4>
        <div className="text-lg font-medium">Existing files:</div>
        <div className="flex flex-col gap-4">
          {files.map((file) => (
            <div key={file.id} className="flex flex-row gap-4">
              <p>{file.name}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={() => handleDelete()}
          >
            Wipe App Data
          </button>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={() => navigate("/")}
          >
            Go To Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default WipeApp;
