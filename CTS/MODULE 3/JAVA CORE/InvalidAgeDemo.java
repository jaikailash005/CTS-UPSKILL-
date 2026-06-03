class InvalidAgeException extends Exception {
    InvalidAgeException(String msg) {
        super(msg);
    }
}

public class InvalidAgeDemo {

    static void checkAge(int age) throws InvalidAgeException {
        if(age < 18)
            throw new InvalidAgeException("Age must be 18 or above");
        else
            System.out.println("Eligible");
    }

    public static void main(String[] args) {
        try {
            checkAge(15);
        }
        catch(InvalidAgeException e) {
            System.out.println(e.getMessage());
        }
    }
}