import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  compose,
  equals,
  head,
  pluck,
} from 'ramda'
import { withRouter } from 'react-router-dom'

import CaptureContainer from '../../containers/Capture'
import {
  receiveCapture,
  requestCapture,
} from './actions'

const mapStateToProps = ({
  account: { client },
}) => ({ client })

const mapDispatchToProps = ({
  onReceiveCapture: receiveCapture,
  onRequestCapture: requestCapture,
})

const enhanced = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)

const isBoleto = equals('boleto')

class Capture extends Component {
  constructor (props) {
    super(props)

    const {
      isFromCheckout,
      transaction,
    } = props
    const {
      payment: {
        method: paymentMethod,
      },
    } = transaction

    const isBoletoOrFromCheckout = isFromCheckout || isBoleto(paymentMethod)

    const captureAmount = isBoletoOrFromCheckout
      ? transaction.payment.authorized_amount.toString()
      : '0'

    this.state = {
      captureAmount,
      error: null,
      loading: false,
      stepStatus: {
        confirmation: 'pending',
        identification: 'current',
      },
    }

    this.handleClose = this.handleClose.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleRetry = this.handleRetry.bind(this)
  }

  handleConfirm ({ captureAmount }, formErrors) {
    if (!formErrors) {
      this.setState({
        loading: true,
      })

      const {
        client,
        onReceiveCapture,
        onRequestCapture,
        transaction: {
          id,
        },
      } = this.props

      onRequestCapture()

      client.transactions.capture({
        amount: captureAmount,
        id,
      }).then(() => {
        this.setState({
          captureAmount,
          stepStatus: {
            confirmation: 'success',
            identification: 'success',
          },
        })

        onReceiveCapture()
      }).catch(({ response }) => {
        const { errors } = response

        const errorMessage = head(pluck('message', errors))

        this.setState({
          error: errorMessage,
          stepStatus: {
            confirmation: 'error',
            identification: 'success',
          },
        })

        onReceiveCapture(errorMessage)
      })
    }
  }

  handleClose () {
    const {
      onClose,
      onSuccess,
      transaction: {
        id,
      },
    } = this.props
    const { stepStatus } = this.state

    if (stepStatus.confirmation === 'success') {
      onSuccess(id)
    }

    onClose()
  }

  handleRetry () {
    this.setState({
      loading: false,
      stepStatus: {
        confirmation: 'pending',
        identification: 'current',
      },
    })
  }

  render () {
    const {
      isFromCheckout,
      isOpen,
      t,
      transaction,
    } = this.props

    const {
      captureAmount,
      error,
      loading,
      stepStatus,
    } = this.state

    return (
      <CaptureContainer
        authorizedAmount={transaction.payment.authorized_amount}
        captureAmount={captureAmount}
        isFromCheckout={isFromCheckout}
        isOpen={isOpen}
        loading={loading}
        onCancel={this.handleClose}
        onConfirm={this.handleConfirm}
        onRetry={this.handleRetry}
        onViewTransaction={this.handleClose}
        statusMessage={error}
        stepStatus={stepStatus}
        t={t}
        transaction={transaction}
      />
    )
  }
}

Capture.propTypes = {
  client: PropTypes.shape({}).isRequired,
  isFromCheckout: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReceiveCapture: PropTypes.func.isRequired,
  onRequestCapture: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  transaction: PropTypes.shape({}).isRequired,
}

export default enhanced(Capture)
