<script setup lang="ts">
useHead({
  title: 'About - DTT Real Estate',
  meta: [
    {
      name: 'description',
      content:
        'Learn about DTT Real Estate and our commitment to helping you find your perfect home.',
    },
  ],
})
</script>

<template>
  <div class="about">
    <div class="about__container">
      <div class="about__content">
        <!-- Main section -->
        <section class="about__section">
          <h1 class="about__title">About DTT Real Estate</h1>
          <div class="about__text-block">
            <p class="about__paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <p class="about__paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        <!-- Design and Development section -->
        <section class="about__section about__section--development">
          <h2 class="about__subtitle">Design and Development</h2>

          <div class="about__company">
            <div class="about__logo">
              <img
                src="/public/assets/img_logo_dtt@3x.png"
                alt="DTT Logo"
                width="180"
                height="60"
                class="about__logo-image"
              />
            </div>

            <div class="about__company-info">
              <p class="about__company-text">By DTT</p>
              <a
                href="https://www.d-tt.nl"
                class="about__company-link"
                target="_blank"
                rel="noopener"
              >
                www.d-tt.nl
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about {
  min-height: 100vh;
  background: $background-1;

  &__container {
    max-width: $container-lg;
    margin: 0 auto;
    padding: $spacing-md;

    @media (min-width: $breakpoint-lg) {
      padding: $spacing-lg $spacing-xl;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-2xl;

    @media (min-width: $breakpoint-lg) {
      gap: $spacing-3xl;
    }
  }

  &__section {
    &--development {
      padding-top: $spacing-xl;
    }
  }

  &__title {
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    font-size: $font-size-h1-mobile;
    color: $text-primary;
    margin: 0 0 $spacing-lg 0;
    line-height: 1.2;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h1-desktop;
      margin-bottom: $spacing-xl;
    }
  }

  &__subtitle {
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    font-size: $font-size-h2-mobile;
    color: $text-primary;
    margin: 0 0 $spacing-lg 0;
    line-height: 1.2;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h2-desktop;
      margin-bottom: $spacing-xl;
    }
  }

  &__text-block {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__paragraph {
    font-family: $font-family-secondary;
    font-weight: $font-weight-regular;
    font-size: $font-size-body-mobile;
    color: $text-secondary;
    line-height: 1.6;
    margin: 0;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  &__company {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    @media (min-width: $breakpoint-lg) {
      flex-direction: row;
      align-items: center;
      gap: $spacing-lg;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__logo-icon {
    flex-shrink: 0;
  }

  &__logo-svg {
    border-radius: $border-radius-sm;
  }

  &__logo-text {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__logo-dtt {
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    font-size: 28px;
    color: $text-primary;
    line-height: 1;

    @media (min-width: $breakpoint-lg) {
      font-size: 32px;
    }
  }

  &__logo-tagline {
    font-family: $font-family-secondary;
    font-weight: $font-weight-regular;
    font-size: $font-size-input-field-mobile;
    color: $text-secondary;
    letter-spacing: 1px;
    line-height: 1;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-input-field-desktop;
    }
  }

  &__company-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__company-text {
    font-family: $font-family-secondary;
    font-weight: $font-weight-regular;
    font-size: $font-size-body-mobile;
    color: $text-secondary;
    margin: 0;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  &__company-link {
    font-family: $font-family-secondary;
    font-weight: $font-weight-regular;
    font-size: $font-size-body-mobile;
    color: $text-link;
    text-decoration: none;
    transition: color $transition-fast ease;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }

    &:hover {
      color: $primary-color;
      text-decoration: underline;
    }
  }
}
</style>
