import React from 'react'
import PropTypes from 'prop-types'
import {
  always,
  either,
  ifElse,
  isEmpty,
  isNil,
  objOf,
  pipe,
  propOr,
} from 'ramda'
import Form from 'react-vanilla-form'
import {
  Button,
  Card,
  CardContent,
  Col,
  DateInput,
  FormInput,
  Grid,
  RadioGroup,
  Row,
  SegmentedSwitch,
  Spacing,
  isMomentPropValidation,
} from 'former-kit'
import IconCalendar from 'emblematic-icons/svg/Calendar32.svg'

import CurrencyInput from '../../../components/CurrencyInput'
import formatCurrency from '../../../formatters/currency'
import greaterThanValidation from '../../../validation/greaterThan'
import lessThanValidation from '../../../validation/lessThan'
import numberValidation from '../../../validation/number'
import requiredValidation from '../../../validation/required'
import style from './style.css'

const validateDate = (t, isValidDay) => pipe(
  propOr(null, 'start'),
  ifElse(
    isValidDay,
    always(false),
    always(t('pages.anticipation.date.error'))
  )
)

const buildError = ifElse(
  either(isEmpty, isNil),
  always(null),
  objOf('requested')
)

const AnticipationForm = ({
  anticipationInfo,
  dates,
  error,
  isAutomaticTransfer,
  isValidDay,
  loading,
  maximum,
  minimum,
  onChange,
  onSubmit,
  periodInfo,
  requested,
  t,
  timeframe,
  transferInfo,
}) => (
  <Form
    data={{
      dates,
      requested: requested
        ? requested.toString()
        : '0',
      timeframe,
      transfer: isAutomaticTransfer
        ? 'yes'
        : 'no',
    }}
    errors={buildError(error)}
    validation={{
      date: validateDate(t, isValidDay),
      requested: [
        requiredValidation(t('pages.anticipation.required_error')),
        numberValidation(t('pages.anticipation.number')),
        greaterThanValidation(maximum, t('pages.anticipation.maximum_error')),
        lessThanValidation(minimum, t('pages.anticipation.minimum_error')),
      ],
    }}
    onChange={onChange}
    onSubmit={onSubmit}
  >
    <Card className={style.content}>
      <CardContent>
        <Grid>

          <Row>
            <Col>
              <label htmlFor="timeframe" className={style.label}>
                <span>{t('pages.anticipation.period.title')}</span>
                <Spacing size="tiny" />
                {periodInfo}
              </label>
              <SegmentedSwitch
                disabled={loading}
                name="timeframe"
                options={[
                  {
                    title: t('pages.anticipation.start'),
                    value: 'start',
                  },
                  {
                    title: t('pages.anticipation.from_end'),
                    value: 'end',
                  },
                ]}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <label htmlFor="dates" className={style.label}>
                {t('pages.anticipation.date.label')}
                <Spacing size="tiny" />
                {anticipationInfo}
              </label>
              <DateInput
                dates={dates}
                disabled={loading}
                icon={<IconCalendar width={16} height={16} />}
                isValidDay={isValidDay}
                name="dates"
                selectionMode="single"
                showSidebar={false}
                strings={{
                  end: t('pages.anticipation.end'),
                  select: t('pages.anticipation.select'),
                  start: t('pages.anticipation.initial'),
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <FormInput
                disabled={loading}
                error={error}
                label={t(
                  'pages.anticipation.requested.label',
                  { currency: t('currency_symbol') }
                )}
                name="requested"
                renderer={props => (
                  <CurrencyInput
                    max={maximum}
                    {...props}
                  />
                )}
                type="text"
              />
            </Col>
            <Col>
              <div className={style.availableTitle}>{t('pages.anticipation.available.title')}</div>
              <div className={style.availableContainer}>
                <span>{t('pages.anticipation.available.min')}</span>
                <strong className={style.available}>
                  {formatCurrency(minimum)}
                </strong>
                <span>{t('pages.anticipation.available.max')}</span>
                <strong className={style.available}>
                  {formatCurrency(maximum)}
                </strong>
              </div>
            </Col>
          </Row>

          <Row>
            <Col
              desk={12}
              palm={12}
              tablet={12}
              tv={12}
            >
              <label htmlFor="transfer" className={style.label}>
                {t('pages.anticipation.transfer.label')}
                <Spacing size="tiny" />
                {transferInfo}
              </label>
              <RadioGroup
                disabled={loading}
                name="transfer"
                options={[
                  {
                    name: t('pages.anticipation.transfer.yes'),
                    value: 'yes',
                  },
                  {
                    name: t('pages.anticipation.transfer.no'),
                    value: 'no',
                  },
                ]}
              />
            </Col>
          </Row>

          <Row>
            <Col
              desk={12}
              palm={12}
              tablet={12}
              tv={12}
            >
              <div>
                <Button
                  disabled={loading}
                  fill="outline"
                  type="submit"
                >
                  {t('pages.anticipation.simulate')}
                </Button>
              </div>
              <hr className={style.spacer} />
              <p className={style.advise}>{t('pages.anticipation.advise')}</p>
            </Col>
          </Row>

        </Grid>
      </CardContent>
    </Card>
  </Form>
)

AnticipationForm.propTypes = {
  anticipationInfo: PropTypes.element.isRequired,
  dates: PropTypes.shape({
    end: isMomentPropValidation,
    start: isMomentPropValidation,
  }).isRequired,
  error: PropTypes.string,
  isAutomaticTransfer: PropTypes.bool.isRequired,
  isValidDay: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  maximum: PropTypes.number,
  minimum: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  periodInfo: PropTypes.element.isRequired,
  requested: PropTypes.number,
  t: PropTypes.func.isRequired,
  timeframe: PropTypes.oneOf(['end', 'start']).isRequired,
  transferInfo: PropTypes.element.isRequired,
}

AnticipationForm.defaultProps = {
  error: '',
  maximum: null,
  minimum: null,
  requested: 0,
}

export default AnticipationForm
