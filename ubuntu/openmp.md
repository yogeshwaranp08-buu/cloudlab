1. Sum of Two Numbers Using OpenMP
OpenMP uses multiple threads within a single process to perform parallel work.
Step 1: Install GCC
sudo apt update
sudo apt install gcc -y


Step 2: Create the program
nano sum_openmp.c


Copy this code:

#include <stdio.h>
#include <omp.h>

int main() {
    int a = 10, b = 20, sum = 0;

    #pragma omp parallel
    {
        #pragma omp single
        {
            sum = a + b;
            printf("Addition performed by thread %d\n",
                   omp_get_thread_num());
        }
    }

    printf("Sum = %d\n", sum);

    return 0;
}



Save using Ctrl+O, Enter, and Ctrl+X.
Step 3: Compile and execute
gcc -fopenmp sum_openmp.c -o sum_openmp
./sum_openmp


Expected output:
Addition performed by thread 0
Sum = 30


2. Sum of Two Numbers Using MPI
MPI (Message Passing Interface) allows multiple processes to communicate by sending and receiving messages.
Step 1: Install MPI
sudo apt update
sudo apt install mpich -y


Step 2: Create the program
nano sum_mpi.c


Copy this simple code:

#include <stdio.h>
#include <mpi.h>

int main(int argc, char *argv[]) {
    int rank, a = 10, b = 20, sum = 0;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    if (rank == 0) {
        sum = a + b;
        printf("Sum = %d\n", sum);
    }

    MPI_Finalize();
    return 0;
}



Save the file.
Step 3: Compile and execute
Compile:
mpicc sum_mpi.c -o sum_mpi


Run with 4 processes:
mpirun -np 4 ./sum_mpi