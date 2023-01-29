-- CreateTable
CREATE TABLE "Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "html_url" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "contents_url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "pushed_at" DATETIME NOT NULL,
    "size" INTEGER NOT NULL,
    "stargazers_count" INTEGER NOT NULL,
    "watchers_count" INTEGER NOT NULL,
    "language" TEXT,
    "forks_count" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "disabled" BOOLEAN NOT NULL,
    "open_issues_count" INTEGER NOT NULL,
    "license" TEXT,
    "allow_forking" BOOLEAN NOT NULL,
    "topics" TEXT,
    "open_issues" INTEGER NOT NULL,
    "watchers" INTEGER NOT NULL,
    "default_branch" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "raw_request" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FilesTree" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "size" INTEGER,
    "url" TEXT NOT NULL,
    "content" TEXT,
    "repositoryId" INTEGER NOT NULL,
    CONSTRAINT "FilesTree_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_full_name_key" ON "Repository"("full_name");
