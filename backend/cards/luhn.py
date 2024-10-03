class LuhnAlgorithm:
    def __init__(self, input_value: str) -> None:
        self.input_value = input_value.replace(' ', '')

    def new_number(self, input_value: str) -> None:
        self.input_value = input_value.replace(' ', '')

    def last_digit_and_remaining_numbers(self) -> tuple:
        return int(self.input_value[-1]), self.input_value[:-1]

    def checksum(self) -> bool:
        last_digit, remaining_numbers = self.last_digit_and_remaining_numbers()
        nums = [int(num) if idx % 2 != 0 else int(num) * 2 if int(num) * 2 <= 9 \
            else int(num) * 2 % 10 + int(num) * 2 // 10 \
                for idx, num in enumerate(reversed(remaining_numbers))]

        return (sum(nums) + last_digit) % 10 == 0

    def verify(self) -> bool:
        return self.checksum()
