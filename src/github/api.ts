import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { injectAxiosDebug } from '../lib/injectAxiosDebug'
import { RepositoryTreeResponse, SearchRepositoriesResponse } from './types'

export class GithubApi {
  constructor(public readonly axios: AxiosInstance) {}

  static create(debug: boolean = false): GithubApi {
    const instance = axios.create({
      baseURL: 'https://api.github.com',
      timeout: 10000,
      headers: {
        Authorization: `Bearer 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`,
      },
    })
    if (debug) injectAxiosDebug(instance)
    return new GithubApi(instance)
  }

  searchRepositories(query: SearchRepositoriesQuery): Promise<AxiosResponse<SearchRepositoriesResponse>> {
    return this.axios.get(`/search/repositories`, { params: query })
  }

  getRepositoryTree(
    params: RepositoryTreeParams,
    query: RepositoryTreeQuery,
  ): Promise<AxiosResponse<RepositoryTreeResponse>> {
    const { owner, repo, tree_sha } = params
    return this.axios.get(`/repos/${owner}/${repo}/git/trees/${tree_sha}`, { params: query })
  }

  getRawData(params: RawDataParams): Promise<AxiosResponse<string>> {
    return this.axios.get(this.getRawDataUrl(params))
  }

  getRawDataUrl(params: RawDataParams): string {
    const { owner, repo, tree_sha, path } = params
    return `https://raw.githubusercontent.com/${owner}/${repo}/${tree_sha}/${path}`
  }
}

type RawDataParams = {
  owner: string
  repo: string
  tree_sha: string
  path: string
}

type RepositoryTreeQuery = {
  recursive?: number
}
type RepositoryTreeParams = {
  owner: string
  repo: string
  tree_sha: string
}

type SearchRepositoriesQuery = {
  q: string
  type?: 'Code' | 'Issues' | 'Commits' | 'Wikis' | 'Users' | 'Repositories'
  ref?: 'advsearch' | 'simplesearch'
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated'
  order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}
