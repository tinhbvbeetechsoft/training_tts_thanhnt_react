/**
 * Custom thông báo lỗi validate
 */
import * as yup from 'yup';
import moment from 'moment';
yup.addMethod<yup.DateSchema>(yup.date, "format", function (format: string) {
    return this.transform((value: yup.DateSchema, input: string) => {
        const parsed = moment(input, format, true);
        return parsed.isValid() ? parsed.toDate() : 'invalidDate';
    });
});

yup.setLocale({
    mixed: {
        required: () => ({ key: 'common.validateRequired' }),
    },
    string: {
        min: ({ min }) => ({ key: 'common.validateMinLength', values: { min } }),
        max: ({ max }) => ({ key: 'common.validateMaxLength', values: { max } }),
    },
    number: {
        min: ({ min }) => ({ key: 'common.validateMinLength', values: { min } }),
        max: ({ max }) => ({ key: 'common.validateMinLength', values: { max } }),
    }
});
