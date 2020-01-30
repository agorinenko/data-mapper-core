import TestUserDataMapper from "./test_user_data_mapper";

test('two plus two is four', async () => {
    const dataMapper = new TestUserDataMapper()
    const items = await dataMapper.getItems();
    expect(2 + 2).toBe(4);
});
