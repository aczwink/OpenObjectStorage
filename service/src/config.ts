/**
 * OpenObjectStorage
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

export const CONFIG_DB = {
    host: process.env.OPENOBJECTSTORAGE_DBHOST!,
    user: process.env.OPENOBJECTSTORAGE_DBUSER!,
    password: process.env.OPENOBJECTSTORAGE_DBPW!,
};

export const CONFIG_OIDP_ENDPOINT = process.env.OPENOBJECTSTORAGE_OIDP_ENDPOINT!;
export const CONFIG_ORIGIN = process.env.OPENOBJECTSTORAGE_ORIGIN!;
export const CONFIG_PORT = process.env.OPENOBJECTSTORAGE_PORT;