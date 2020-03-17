import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  anyPass,
  isEmpty,
  is,
  isNil,
} from 'ramda'
import Card from '../Card'
import styles from './styles.css'

const isFunction = is(Function)
const isNilOrEmpty = anyPass([isNil, isEmpty])

const CardOptions = ({
  handleSubmit,
  images,
  options,
}) => (
  <div className={styles.cardOptionsContainer}>
    {options.map(({ description, label, value }, index) => {
      const Image = images[index]

      const hasImage = isFunction(Image)
      const hasDescription = !isNilOrEmpty(description)

      const contentClasses = classNames(
        styles.content,
        {
          [styles.contentWithoutSub]: !hasDescription && hasImage,
          [styles.contentWithoutSubAndIcon]: !hasDescription && !hasImage,
        }
      )

      return (
        <Card
          key={value}
          onSubmit={() => handleSubmit(value)}
        >
          <div className={contentClasses}>
            <div className={styles.cardIcon}>
              {hasImage && <Image />}
            </div>
            <div className={styles.cardText}>
              <p>{label}</p>
              <span>{description}</span>
            </div>
          </div>
        </Card>
      )
    })}
  </div>
)

CardOptions.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.func),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
}

CardOptions.defaultProps = {
  images: [],
}

export default CardOptions
