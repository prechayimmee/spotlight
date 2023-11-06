import { DataType } from '../../datatypes';
import _ from 'lodash';
import { Column } from '../../client';
import { DataColumn } from '../../types';

function makeDatatype(column: Column): DataType {
    const kind = column.dtype.name as DataType['kind'];

    switch (kind) {
        case 'int':
        case 'float':
        case 'bool':
        case 'Window':
        case 'datetime':
        case 'BoundingBox':
            return {
                kind,
                binary: false,
                lazy: false,
                optional: column.optional,
            };
        case 'str':
        case 'array':
        case 'Embedding':
            return {
                kind,
                binary: false,
                lazy: true,
                optional: column.optional,
            };
        case 'Image':
        case 'Video':
        case 'Audio':
        case 'Mesh':
        case 'Sequence1D':
            return {
                kind,
                binary: true,
                lazy: true,
                optional: column.optional,
            };
        case 'Category':
            return {
                kind,
                binary: false,
                lazy: false,
                optional: column.optional,
                categories: column.dtype.categories ?? {},
                invertedCategories: _.invert(column.dtype.categories ?? {}),
            };
        case 'Sequence':
            return {
                kind,
                binary: false,
                lazy: true,
                optional: column.optional,
                dtype: column.dtype.dtype,
                length: column.dtype.length,
            };
    }
    return {
        kind: 'Unknown',
        lazy: false,
        binary: false,
        optional: column.optional,
    };
}

export function makeColumn(column: Column, index: number): DataColumn {
    const col: DataColumn = {
        index,
        key: column.name,
        name: column.name,
        type: makeDatatype(column),
        editable: column.editable,
        optional: column.optional,
        hidden: column.hidden,
        description: column.description ?? '',
        tags: _.uniq(column.tags),
    };

    return col;
}
