/**
 * OpenDistributedFileStorage
 * Copyright (C) 2024 Amir Czwink (amir130@hotmail.de)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * */

import { Injectable } from "acts-util-node";
import { DBConnectionsManager } from "./DBConnectionsManager";

@Injectable
export class TagsController
{
    constructor(private dbConnMgr: DBConnectionsManager)
    {
    }

    //Public methods
    public async QueryFileTags(fileId: number)
    {
        const query = `
        SELECT t.tag
        FROM tags t
        INNER JOIN files_tags ft
            ON ft.tagId = t.id
        WHERE ft.fileId = ?
        `;
        const conn = await this.dbConnMgr.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select(query, fileId);
        return rows.map(x => x.tag as string);
    }

    public async QueryTagId(containerId: number, tag: string)
    {
        const conn = await this.dbConnMgr.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne("SELECT id FROM tags WHERE containerId = ? AND tag = ?", containerId, tag);

        return row?.id as number | undefined;
    }

    public async SearchTags(containerId: number, substring: string)
    {
        const conn = await this.dbConnMgr.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select("SELECT tag FROM tags WHERE containerId = ? AND tag LIKE ?", containerId, "%" + substring + "%");
        return rows.map(row => row.tag as string);
    }

    public async UpdateFileTags(fileId: number, tags: string[])
    {
        const conn = await this.dbConnMgr.CreateAnyConnectionQueryExecutor();
        await conn.DeleteRows("files_tags", "fileId = ?", fileId);

        const row = await conn.SelectOne("SELECT containerId FROM files WHERE id = ?", fileId);
        const containerId = row!.containerId;

        const tagIds = await tags.Values().Map(t => this.QueryOrInsertTag(containerId, t)).PromiseAll();
        for (const tagId of tagIds)
        {
            await conn.InsertRow("files_tags", {
                fileId,
                tagId
            });
        }
    }

    //Private methods
    private async QueryOrInsertTag(containerId: number, tag: string)
    {
        const tagId = await this.QueryTagId(containerId, tag);
        if(tagId === undefined)
        {
            const conn = await this.dbConnMgr.CreateAnyConnectionQueryExecutor();
            const result = await conn.InsertRow("tags", { containerId, tag });
            return result.insertId;
        }

        return tagId;
    }
}