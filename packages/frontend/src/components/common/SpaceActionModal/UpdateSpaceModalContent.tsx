import { TextInput, Stack } from '@mantine/core';
import { type FC } from 'react';
import { type SpaceModalBody } from '.';

const UpdateSpaceModalContent: FC<SpaceModalBody> = ({ form }) => (
    <Stack>
        <TextInput
            {...form.getInputProps('name')}
            label="Enter a memorable name for your space"
            placeholder="eg. KPIs"
        />
        <TextInput
                {...form.getInputProps('database.dbtypeId')}
                label="数据库类型"
                placeholder="1"
        />
        <TextInput
            {...form.getInputProps('database.dbUrl')}
            label="数据库url"
            placeholder="jdbc:mysql://127.0.0.1:3306/graph_platform?useSSL=false&useAffectedRows=true"
        />
        <TextInput
            {...form.getInputProps('database.dbUser')}
            label="数据库user"
            placeholder="root"
        />
        <TextInput
            {...form.getInputProps('database.dbPassword')}
            label="数据库password"
            placeholder="123456"
        />
    </Stack>
);

export default UpdateSpaceModalContent;
